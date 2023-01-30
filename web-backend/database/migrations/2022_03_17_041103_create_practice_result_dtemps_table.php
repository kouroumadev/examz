<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePracticeResultDtempsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('practice_result_dtemps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_result_id')->constrained('practice_results')->onDelete('cascade');
            $table->foreignId('practice_question_item_id')->constrained('practice_question_items')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('practice_result_dtemps');
    }
}
